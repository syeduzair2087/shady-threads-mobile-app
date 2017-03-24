import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
// import { Observable } from 'rxjs/Rx'

@Injectable()
export class HttpServices {
    constructor(private _http: Http) { }

    getData() {
        // return this._http.get('http://192.168.0.107:2087/api/getName')
        // .toPromise().then((res: Response) => {
        //     res.json()
        // }).catch((err) => console.log('error!: ' + err))
        return this._http.get('http://192.168.0.107:2087/api/getName')
            .map((res: Response) => res.json())
    }
}