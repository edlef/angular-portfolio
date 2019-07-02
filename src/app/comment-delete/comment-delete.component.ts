import { Component, Output, EventEmitter } from '@angular/core';
import { CommentService } from '../_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-comment-delete',
    templateUrl: 'comment-delete.component.html',
})
export class CommentDeleteComponent {

    @Output() refresh = new EventEmitter();

    constructor(private commentService: CommentService) {}

    deleteAll() {
        this.commentService.deleteAll()
        .pipe(first())
        .subscribe();
    }
}
