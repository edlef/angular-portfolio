import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { CommentService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
    currentUser: User;
    comments = [];

    constructor(
        private authenticationService: AuthenticationService,
        private commentService: CommentService,
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.loadAllComments();
    }

    private loadAllComments() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
    }

    deleteComment(id: number) {
        this.commentService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllComments());
    }   

}