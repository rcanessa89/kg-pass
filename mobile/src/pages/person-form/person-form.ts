import { Component, ViewChild  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ApiService } from '../../providers/Api';
import { HomePage } from '../home/home';

import { IElector } from '../../models/IElector';
import { IPerson } from '../../models/IPerson';

@Component({
  selector: 'person-form',
  templateUrl: 'person-form.html'
})
export class PersonFormPage {
  constructor(
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public api: ApiService,
    public navCtrl: NavController
  ) {
    this.personForm = new FormGroup(this.formControls());
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  public personForm: FormGroup;
  public signaturePadOptions: Object = {
    canvasWidth: 500,
    canvasHeight: 200
  };

  public personFormSubmit(): void {
    if (this.signaturePad.isEmpty()) {
      return this.showPromptInvalid('Signature is required');
    } else {
      const signatureBase64 = this.signaturePad.toDataURL().split(',')[1];

      this.personForm.controls['signature'].setValue(signatureBase64);
    }

    if (this.personForm.invalid) {
      return this.showPromptInvalid('All the fields are required');
    }

    this.savePerson(this.personForm.value);
  }

  public deleteSignature(): void {
    this.signaturePad.clear();
  }

  private showPromptInvalid(message: string): void {
    const alert = this.alertCtrl.create({
      title: 'Form Invalid',
      subTitle: message,
      buttons: ['Dismiss']
    });

    alert.present();
  }

  private formControls(): any {
    const elector: IElector = this.navParams.get('elector');

    return {
      id: new FormControl(elector.id, [ Validators.required ]),
      name: new FormControl(elector.name, [ Validators.required ]),
      first_last_name: new FormControl(elector.first_last_name, [ Validators.required ]),
      second_last_name: new FormControl(elector.second_last_name, [ Validators.required ]),
      signature: new FormControl('', [ Validators.required ]),
    };
  }

  private savePerson(formValue: any): void {
    const body: IPerson = {
      cedula: formValue.id,
      name: formValue.name,
      last_name: `${formValue.first_last_name} ${formValue.second_last_name}`,
      check_in: new Date(),
      check_out: null,
      signature: formValue.signature
    };

    const url = 'people';

    this.api.call(url, 'post', body)
      .subscribe((person: IPerson) => {
        const alert = this.alertCtrl.create({
          title: 'Register Successful',
          subTitle: `Welcome ${person.name}`
        });
    
        alert.present();

        setTimeout(() => {
          alert.dismiss();
          this.navCtrl.push(HomePage);
        }, 1200);
      });
  }
}
