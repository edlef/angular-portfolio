import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, CommentService } from '../_services';

@Component({ 
    selector: 'app-comment-form',
    templateUrl: 'comment-form.component.html' 
})
export class CommentFormComponent implements OnInit {
    commentForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private commentService: CommentService,
        private alertService: AlertService
    ) {
        
    }

    ngOnInit() {
        this.commentForm = this.formBuilder.group({
            username: ['', Validators.required],
            content: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.commentForm.controls; }

    onSubmit() {

        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.commentForm.invalid) {
            return;
        }

        this.loading = true;

        this.commentService.create(this.commentForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('post successful', true);
                    this.loading = false;
                    this.commentForm.reset();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
        });
        
    }
}
