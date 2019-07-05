import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { first } from 'rxjs/operators';
import { CommentService } from '../_services';
import { Subject } from 'rxjs';
import { CommentDeleteComponent } from '../comment-delete';

@Component({
    selector: 'app-comment-list',
    templateUrl: 'comment-list.component.html',
})

export class CommentListComponent {
    comments = [];
    user = [];
    private eventsSubject: Subject<void> = new Subject<void>();
    visible: boolean = true;

    @Input() data;

    constructor(
        private commentService: CommentService
    ) {

    }

    ngOnInit() {
        this.loadAllComments();
        this.user = this.data;
    }

    toggleVisible(id: number) {
        this.comments.forEach((comment, index) => {
            if(comment.id === id) {
                comment.visible = false;
                this.comments[index] = comment;
            }
        });
    }

    edit(id) {
        this.toggleVisible(id);
        this.eventsSubject.next(id);
    }

    deleteComment(id: number) {
        this.commentService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllComments());
    }   

    deleteList() {
        this.comments = [];
    }

    toggleEditForm(id) {
        this.toggleVisible(id);
    }


    private loadAllComments() {
        this.commentService.getAll()
            .pipe(first())
            .subscribe(comments => this.comments = comments);
    }

}
