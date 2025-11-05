import { Low } from 'lowdb';

export class WrightController {
    private writePending: boolean = false;
    private readonly db: Low<any>;
    private readonly delay: number = 5000;

    constructor(db: Low<any>, delay?: number) {
        this.db = db;
        if (delay) {
            this.delay = delay;
        }
    }

    write() {
        if (this.writePending) {
            return;
        }
        this.writePending = true;

        setTimeout(async () => {
            await this.db.write();
            this.writePending = false;
        }, this.delay);
    }
}
