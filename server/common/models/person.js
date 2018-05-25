'use strict';

var xl = require('excel4node');

module.exports = function(Person) {
    Person.observe('before save', function(ctx, next) {
        if (ctx.instance) {
            ctx.instance.signature = base64ToBuffer(ctx.instance.signature);
        } else {
            ctx.data.signature = base64ToBuffer(ctx.data.signature);
        }
        
        return next();
    });

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
            }
        ],
        "returns": [
            {
              "arg": "excel",
              "root": true,
              "description": "Excel file"
            }
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
        if (!to) {
            to = new Date();
        }

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
            var excel = persons;

            callback(null, excel);
        });
    };
};

function base64ToBuffer(base64) {
    return new Buffer(base64, 'base64').toString('utf8');
}

function createExcel(persons) {
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');

    //console.log(persons);
}
