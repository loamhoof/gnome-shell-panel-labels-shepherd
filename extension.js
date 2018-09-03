const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const St = imports.gi.St;


let buttons = {}, server;

function init() {
    server = new Soup.Server();

    server.add_handler(null, (_, msg, path) => {
        const id = path.substr(1);
        const label = '' + msg['request-body-data'].toArray();

        if (!label) {
            if (!(id in buttons)) {
                return
            }

            Main.panel._rightBox.remove_child(buttons[id]);
            delete buttons[id];

            return
        }

        if (!(id in buttons)) {
            buttons[id] = new St.Button({ style_class: 'panel-button', label: label });
            Main.panel._rightBox.insert_child_at_index(buttons[id], 0);

            return
        }

        buttons[id].set_label(label);
    });

    server.listen_all(15000, 0); // Soup.ServerListenOptions.IPV4_ONLY
}

function enable() {
}

function disable() {
    for (const id in buttons) {
        Main.panel._rightBox.remove_child(buttons[id]);
        delete buttons[id];
    }
}
