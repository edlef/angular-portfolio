import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Comment } from '../_models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AlertService, CommentService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-comment-edit-form',
  templateUrl: './comment-edit-form.component.html',
})

export class CommentEditFormComponent implements OnInit {

    commentForm: FormGroup;
    visible: boolean = false;
    private eventsSubscription: any;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private commentService: CommentService,
        private alertService: AlertService
      
      ) { }

    @Input() comment: Comment;
    @Input() show: Observable<void>;
    @Output() saved = new EventEmitter();

    ngOnInit() {

      this.initForm();
      this.eventsSubscription = this.show.subscribe(id => this.state(id));

    }

    state(id) {

      if(this.comment.id === id) {
        this.visible = !this.visible;
      }
    }

    edit(id: number) {

      this.saved.emit(id);

      this.state(id);

      this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.commentForm.invalid) {
            return;
        }

        this.commentService.edit(this.commentForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.initForm();
                },
                error => {
                    this.alertService.error(error);
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.commentForm.controls; }

    private initForm() {

      this.commentForm = this.formBuilder.group({
          id: this.comment.id,
          username: [this.comment.username, Validators.compose([Validators.required, Validators.pattern(/.*\S.*/)])],
          content: [this.comment.content, Validators.compose([Validators.required, Validators.pattern(/.*\S.*/)])],
          date: this.comment.date,
          image: this.comment.image,
          visible: true
      });
    }

    ngOnDestroy() {
      this.eventsSubscription.unsubscribe()
    }
  
}

