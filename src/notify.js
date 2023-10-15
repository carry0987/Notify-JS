const version = '__version__';
let permissionGranted = false;

class Notify {
    constructor(title, options) {
        this.defaultOptions = {
            icon: null,
            lang: 'en-US',
            onClick: function() {},
            onClose: function() {},
            onError: function() {},
        };

        this.title = title;
        this.options = Object.assign({}, this.defaultOptions, options);
        this.options.tag = Notify.generateTag();
    }

    static s4 () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    static generateTag() {
        return `${Notify.s4() + Notify.s4()}-${Notify.s4()}-${Notify.s4()}-${Notify.s4()}-${Notify.s4() + Notify.s4() + Notify.s4()}`;
    }

    static requestPermission() {
        return new Promise(function(resolve, reject) {
            Notification.requestPermission(function(permission) {
                permissionGranted = permission === 'granted';
                if (permissionGranted) {
                    resolve();
                } else {
                    reject('Permission was not granted');
                }
            });
        });
    }

    launch () {
        if (permissionGranted) {
            this.notification = new Notification(this.title, this.options);
            this.notification.onClick = this.options.onClick;
            this.notification.onError = this.options.onError;
            this.notification.onClose = this.options.onClose;
            return Promise.resolve(this.notification);
        } else {
            return Notify.requestPermission()
                .then(() => this.launch())
                .catch(console.warn.bind(console));
        }
    }
}

export default Notify;
