import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    loading = false;
    user: User;
    userFromApi: User;

    uploadForm: FormGroup;
    uploadedFiles: Array<File>;

    arregloString: Array<string>;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private authenticationService: AuthenticationService
    ) {
        this.user = this.authenticationService.userValue;
    }

    ngOnInit() {

        this.uploadForm = this.formBuilder.group({
            file: ['']
        });

        this.loading = true;
        this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
            this.loading = false;
            this.userFromApi = user;
        });
    }

    fileChange(element) {
        this.uploadedFiles = element.target.files;
    }

    test() {

    }

    async upload() {
        let formData = new FormData();
        for (var i = 0; i < this.uploadedFiles.length; i++) { 
            this.arregloString = new Array<string>();

            try { 
                const fileContents = await this.readUploadedFileAsText(this.uploadedFiles[i]) 
                              
                console.log(fileContents);

                var lines = fileContents.toString().split('\n');
                for(var line = 0; line < lines.length; line++){
                  console.log(lines[line]);
                  this.arregloString.push(lines[line]);
                }
                debugger;
              } catch (e) {
                console.warn(e.message)
              }

        } 
    }

    readUploadedFileAsText = (inputFile) => {
        const temporaryFileReader = new FileReader();
      
        return new Promise((resolve, reject) => {
          temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
          };
      
          temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
          };
          temporaryFileReader.readAsText(inputFile);
        });
      };
}