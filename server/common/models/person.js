'use strict';

var xl = require('excel4node');
var moment = require('moment');
var fs = require('fs');
var sizeOf = require('image-size');
var bt = require('buffer-type');

module.exports = function(Person) {
    // Person.observe('before save', function(ctx, next) {
    //     console.log(ctx.instance.signature);

    //     if (ctx.instance) {
    //         ctx.instance.signature = decodeBase64Image(ctx.instance.signature).data;
    //     } else {
    //         ctx.data.signature = decodeBase64Image(ctx.data.signature).data;
    //     }
        
    //     return next();
    // });

    Person.remoteMethod('excel', {
        "accepts": [
            {
              "arg": "from",
              "type": "date",
              "required": true,
              "description": "From date"
            },
            {
              "arg": "to",
              "type": "date",
              "required": true,
              "description": "To date"
            },
        ],
        returns: [
            {arg: 'body', type: 'file', root: true},
            {arg: 'Content-Type', type: 'string', http: { target: 'header' }}
        ],
        "description": "Export excel file with registers",
        "http": [
            {
              "path": "/excel",
              "verb": "post"
            }
        ]
    });
    
    /**
     * Export a excel file
     * @param {date} from From date
     * @param {date} to To date
     * @param {Function(Error, )} callback
     */
    Person.excel = function(from, to, callback) {
        Person.find({
            where: {
                check_in: {
                    gte: from
                },
                check_out: {
                    lte: to,
                    nin: [null]
                }
            }
        }, function(error, persons) {
            var excel;

            createExcel(persons)
                .then(function(buffer) {
                    excel = buffer;

                    callback(null, excel, 'application/download');
                });
        });
    };
};

// function base64ToBuffer(base64) {
//     return Buffer.from(base64, 'base64');
// }

// function decodeBase64Image(dataString) {
//     //console.log(dataString);
//     var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//         response = {};

//     if (matches.length !== 3) {
//         return new Error('Invalid input string');
//     }

//     response.type = matches[1];
//     response.data = new Buffer(matches[2], 'base64');

//     return response;
// }

function createExcel(persons) {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Registros');
    var headers = [
        'Cedula',
        'Nombre',
        'Apellidos',
        'Entrada',
        'Salida',
        'Firma'
    ];
    var headerStyle = wb.createStyle({
        font: {
            color: '#FF0800',
            size: 14,
            weight: 'bold'
        }
    });

    ws.column(1).setWidth(20);
    ws.column(2).setWidth(25);
    ws.column(3).setWidth(35);
    ws.column(4).setWidth(25);
    ws.column(5).setWidth(25);
    ws.column(6).setWidth(40);

    headers.forEach(function(header, index) {
        ws.cell(1, (index + 1)).string(header).style(headerStyle);
    });

    persons.forEach(function(person, index) {
        const row = (index + 2);

        ws.cell(row, 1).number(person.cedula);
        ws.cell(row, 2).string(person.name);
        ws.cell(row, 3).string(person.last_name);
        ws.cell(row, 4).string(moment(person.check_in).format('DD/MM/YYYY h:mma'));
        ws.cell(row, 5).string(moment(person.check_out).format('DD/MM/YYYY h:mma'));
        //ws.cell((index + 1), 6).string(person);

        //console.log(person.signature);


        //console.log(fs.readSync(0, Buffer.from(person.signature.data)));

        //console.log(sizeOf(Buffer.from(person.signature.data)));

        //console.log(fs.writeFileSync('signature.png', person.signature));

        //console.log(fs.readFileSync('lorem.png').toJSON());

        console.log(bt(Buffer.from(person.signature.data)));

        //console.log(Buffer.isBuffer(person.signature.data));

        // ws.addImage({
        //     image: fs.writeFileSync('signature.png', person.signature),
        //     name: 'signature',
        //     type: 'picture',
        //     position: {
        //         type: 'oneCellAnchor',
        //         from: {
        //             col: 6,
        //             row: row
        //         }
        //     }
        // });
    });

    return new Promise(function(resolve) {
        wb.writeToBuffer().then(function(buffer) {
            resolve(buffer);
        });
    });

    //console.log(persons);
}
