import {Pipe, PipeTransform} from '@angular/core';
import {ACCESS_RIGHTS} from "../types";

@Pipe({
    name: 'accessRights',
    standalone: true
})
export class AccessRightsPipe implements PipeTransform {
    transform(value: ACCESS_RIGHTS): string {
        switch (value) {
            case ACCESS_RIGHTS.NONE:
                return 'None';
            case ACCESS_RIGHTS.USER:
                return 'User';
            case ACCESS_RIGHTS.ADMIN:
                return 'Admin';
            default:
                return 'Unknown';
        }
    }
}
