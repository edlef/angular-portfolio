import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 
import { Comment } from '../_models';


@Injectable({ providedIn: 'root' })
export class CommentService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Comment[]>(`${environment.apiUrl}/comments`);
    }

    create(comment: Comment) {
        return this.http.post(`${environment.apiUrl}/comments`, comment);
    }

    delete(id: number) {
        return this.http.delete(`${environment.apiUrl}/comments/${id}`);
    }

    deleteAll() {
        return this.http.delete(`${environment.apiUrl}/comments`);
    }

}