import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { usersData } from '../users-data';

// array in local storage for registered users
// let users = JSON.parse(localStorage.getItem('users')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        let commentCopy = [];

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/comments') && method === 'POST':
                    return postComments();
                case url.endsWith('/comments') && method === 'PUT':
                    return editComments();    
                case url.endsWith('/comments') && method === 'GET':
                    return getComments();
                case url.match(/\/comments\/\d+$/) && method === 'DELETE':
                    return deleteComments();
                case url.match('/comments') && method === 'DELETE':
                    return deleteAllComments();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = usersData.find(x => x.username === username && x.password === password);
            if (!user) return error("Utilisateur où mot de passe incorrects");
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function postComments() {
            const comment = body;
            commentCopy = comments;
            comment.id = comments.length ? Math.max(...commentCopy.map(x => x.id)) + 1 : 1;
            comments.unshift(comment);
            localStorage.setItem('comments', JSON.stringify(comments));
            return ok();
        }

        function editComments() {
            if (!isLoggedIn()) return unauthorized();
            const editedComment = body;
            comments.forEach((comment, index) => {
                if(comment.id === editedComment.id) {
                    comment.visible = false;
                    comments[index] = editedComment;
                }
            });
            localStorage.setItem('comments', JSON.stringify(comments));
            return ok();
        }

        function getComments() {
            return ok(comments);
        }

        function deleteComments() {
            if (!isLoggedIn()) return unauthorized();

            comments = comments.filter(x => x.id !== idFromUrl());
            localStorage.setItem('comments', JSON.stringify(comments));
            return ok();
        }   

        function deleteAllComments() {
            if (!isLoggedIn()) return unauthorized();
            localStorage.removeItem('comments');
            comments = [];
            return ok();
        }   


        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(usersData);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};