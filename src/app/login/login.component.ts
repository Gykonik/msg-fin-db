import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {finalize, tap} from "rxjs";
import {DividerModule} from "primeng/divider";
import {InputTextModule} from "primeng/inputtext";
import {CardModule} from "primeng/card";
import {DialogModule} from "primeng/dialog";
import {ToggleButtonModule} from "primeng/togglebutton";
import {DropdownModule} from "primeng/dropdown";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, PasswordModule, ButtonModule, FormsModule, DividerModule, InputTextModule, CardModule, DialogModule, ReactiveFormsModule, ToggleButtonModule, DropdownModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    protected loginSubmitted: boolean = false;
    protected registrationSubmitted: boolean = false;
    protected displaySignupDialog: boolean = false;
    protected signupForm!: FormGroup;
    protected loginForm!: FormGroup;

    /**
     * Output login error messages such as "User and Password are not matching" or "User doesn't exist"
     * @protected
     */
    protected loginErrorMessage: string | undefined;

    constructor(private fb: FormBuilder, private authService: AuthenticationService, private router: Router) {
        this.initLoginForm();
        this.resetLoginForm();
        this.initSignupForm()
        this.resetSignupForm();
    }

    protected roles: string[] = [
        'User', "Admin"
    ];

    protected resetSignupForm(): void {
        this.registrationSubmitted = false;
        this.signupForm.reset({
            firstname: '',
            surname: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            role: 'User'
        });

        console.log("ROLES: ", this.roles)
    }

    protected resetLoginForm(): void {
        this.loginForm.reset({
            username: '',
            password: ''
        })
    }

    protected initSignupForm(): void {
        this.signupForm = this.fb.group({
            firstname: ['', Validators.required],
            surname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            username: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            role: ['User', Validators.required]
        }, {validator: this.checkPasswords});
    }

    protected initLoginForm(): void {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    showSignupDialog(): void {
        this.resetSignupForm()
        this.displaySignupDialog = true;
    }

    checkPasswords(group: FormGroup) { // custom validator to check that two fields match
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : {mismatch: true};
    }

    onSignup(): void {
        this.registrationSubmitted = true;
        if (this.signupForm.valid) {
            this.signup()
        }
    }

    login(): void {
        this.loginSubmitted = true;

        this.authService.login(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.router.navigate(['/dashboard']);
                        this.resetLoginForm();
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Login error', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            }),
            finalize(() => {
                // Run code after completion regardless of success or error
            })
        ).subscribe();
    }

    signup(): void {
        this.authService.signup(this.signupForm.getRawValue()).pipe(
            tap({
                next: (success: boolean): void => {
                    if (success) {
                        this.router.navigate(['/dashboard']);
                        this.resetSignupForm()
                    } else {
                        // TODO: Show error message...
                    }
                },
                error: (error) => {
                    console.error('Login error', error);
                    // TODO: Handle server error, shot error message using PrimeNG
                }
            }),
            finalize(() => {
                // Run code after completion regardless of success or error
            })
        ).subscribe();
    }
}
