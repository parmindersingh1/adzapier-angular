import { Observable } from "rxjs";

export declare interface DirtyComponents {
    canDeactivate: () => boolean | Observable<boolean>;
}