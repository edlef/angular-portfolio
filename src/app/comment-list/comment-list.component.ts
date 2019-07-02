import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommentService } from '../_services';

@Component({
    selector: 'app-comment-list',
    templateUrl: 'comment-list.component.html',
})
export class CommentListComponent {
    comments = [];
    user = [];
    @Input() data;

    constructor(
        private commentService: CommentService
    ) {

    }

    ngOnInit() {
        this.loadAllComments();
        this.user = this.data;
    }

    deleteComment(id: number) {
        this.commentService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllComments());
    }   

    deleteList() {
        this.comments = [];
        this.loadAllComments();
    }


    private loadAllComments() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
    }

}
