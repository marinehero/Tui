import * as path from 'path';
import {ipcMain as ipc} from 'electron';
import log from './log';

type State
    = 'normal'
    | 'informed'
    | 'notified'
;

const InformedIcon = path.join(__dirname, '..', 'resources', 'tray-icon-blue@2x.png');
const NotifiedIcon = path.join(__dirname, '..', 'resources', 'tray-icon-red@2x.png');

export default class TrayNotification {
    private state = 'normal';

    constructor(private tray: Electron.Tray, private readonly normalIcon: string) {
        this.subscribe('tuitter:tray:informed', 'informed', InformedIcon);
        this.subscribe('tuitter:tray:notified', 'notified', NotifiedIcon);
        this.subscribe('tuitter:tray:normal', 'normal', this.normalIcon);
    }

    reset() {
        log.debug('Reset notification state: normal');
        this.state = 'normal';
        this.tray.setImage(this.normalIcon);
    }

    private subscribe(channel: string, next: State, icon: string) {
        ipc.on(channel, () => {
            if (this.state === next || this.tray === null) {
                return;
            }
            log.debug(`Notification changed ${this.state} -> ${next}`);
            this.tray.setImage(icon);
            this.state = next;
        });
    }
}
