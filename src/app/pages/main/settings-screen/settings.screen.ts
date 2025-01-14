import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {SourceSelection} from './source-toggle/source-toggle.component';
import {SocketService} from '../../../shared/socket.service';
import {AppStatus, StreamService} from '../../../shared/stream.service';
import * as introJs from 'intro.js/intro.js';

@Component({
    selector: 'app-screen-settings',
    styleUrls: ['./settings.screen.css'],
    templateUrl: './settings.screen.html'
})
export class SettingsScreen implements OnInit {
    public sources: SourceSelection[];
    public status: AppStatus;
    public streaming: boolean = false;
    public sourceScale: number = 1;

    public fadeOut: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef, private electronService: ElectronService, public streamService: StreamService, private socketService: SocketService) {
        this.status = {
            current: 'inactive',
        };
    }

    public ngOnInit() {
        this.electronService.desktopCapturer.getSources({ types: [ 'screen' ] }, (error, sources) => {
            this.sources = sources.map((source, index) => {
                return {
                    source,
                    selected: index === 0,
                };
            });

            this.changeDetectorRef.detectChanges();
        });
    }

    public onSourceScaleChange() {
        this.socketService.emit('source-scale', this.sourceScale);
    }

    public centerScreen() {
        this.socketService.emit('center-screen');
    }

    public startTutorial() {
        introJs().start();
    }
}
