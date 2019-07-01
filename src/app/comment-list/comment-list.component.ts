import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommentService } from '../_services';


@Component({
    selector: 'app-comment-list',
    templateUrl: 'comment-list.component.html',
})
export class CommentListComponent {
    comments = [];

    constructor(
        private commentService: CommentService
    ) {

    }

    ngOnInit() {
        this.loadAllComments();
    }



    private loadAllComments() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
    }

}
