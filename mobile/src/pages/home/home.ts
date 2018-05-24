import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  AlertOptions,
  Alert
} from 'ionic-angular';
import { ApiService } from '../../providers/Api';
import { PersonFormPage } from '../person-form/person-form';

import { IElector } from '../../models/IElector';
import { IPerson } from '../../models/IPerson';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public api: ApiService
  ) {

  }

  public checkIn(): void {
    const options: AlertOptions = {
      title: 'Your ID',
      message: 'Please provide your ID',
      inputs: [
        {
          name: 'id',
          placeholder: 'Enter you ID...'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Enter',
          handler: (data: any) => {
            this.validateCheckIn(data.id);
          }
        }
      ]
    };

    this.showPrompt(options);
  }

  public checkout(): void {
    const options: AlertOptions = {
      title: 'Your ID',
      message: 'Please provide your ID',
      inputs: [
        {
          name: 'cedula',
          placeholder: 'Enter you ID...'
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Enter',
          handler: (data: any) => {
            this.validateCheckOut(data.id);
          }
        }
      ]
    };

    this.showPrompt(options);
  }

  public validateCheckOut(cedula: number): void {
    const url = 'people';
    const filter = {
      where: {
        cedula: cedula,
        check_out: null
      }
    };
    const filterJson = JSON.stringify(filter);
    const fullUrl = `${url}?filter=${filterJson}`;

    this.api.call(fullUrl)
      .subscribe((persons: IPerson[]) => {
        if (persons.length) {
          this.setCheckout(persons[0]);
        } else {
          const errorPropmt: AlertOptions = {
            title: 'Sorry',
            message: "Your are not active"
          };

          this.showPrompt(errorPropmt);
        }
      });
  }

  private showPrompt(options: AlertOptions, time?: number): void {
    const prompt: Alert = this.alertCtrl.create(options);

    prompt.present();

    if (time) {
      setTimeout(() => prompt.dismiss(), time);
    }
  }

  private validateCheckIn(cedula: number): void {
    const url = 'people';
    const filter = {
      where: {
        cedula: cedula,
        check_out: null
      }
    };
    const filterJson = JSON.stringify(filter);
    const fullUrl = `${url}?filter=${filterJson}`;

    this.api.call(fullUrl)
      .subscribe((persons: IPerson[]) => {
        if (persons.length) {
          const activePerson = persons[0];

          const errorPropmt: AlertOptions = {
            title: 'Sorry',
            message: `${activePerson.name} you are already active`,
            buttons: [
              {
                text: 'Exit'
              }
            ]
          };

          this.showPrompt(errorPropmt);

        } else {
          this.getElector(cedula);
        }
      });
  }

  private getElector(id: number): void {
    const url = `electors/${id}`;

    this.api.call(url)
      .subscribe((elector: IElector) => {
        this.goToForm(elector);
      }, error => {
        const errorElector: IElector = {
          code_elec: 0,
          sex: 0,
          expiration_date: 0,
          junta: 0,
          name: '',
          first_last_name: '',
          second_last_name: '',
          id: id
        };

        this.goToForm(errorElector);
      });
  }

  private goToForm(elector: IElector): void {
    this.navCtrl.push(PersonFormPage, {
      elector: elector
    });
  }

  private setCheckout(person: IPerson): void {
    const url = `people/${person.id}`;
    const body: any = {
      ...person,
      check_out: new Date()
    };

    this.api.call(url, 'put', body)
      .subscribe((person: IPerson) => {
        const options: AlertOptions = {
          title: 'Check Out',
          message: 'Thank You, See Ya!',
        };

        this.showPrompt(options, 2000);
      });
  }
}
