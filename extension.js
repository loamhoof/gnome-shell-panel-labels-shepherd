const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const St = imports.gi.St;


let buttons = {}, server, timeout;

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
            buttons[id] = new St.Button({ style_class: 'shepherd-label', label: label });
            buttons[id].shepherdManaged = true;
            Main.panel._rightBox.insert_child_at_index(buttons[id], 0);

            return
        }

        buttons[id].set_label(label);
    });

    server.listen_all(15000, 0); // Soup.ServerListenOptions.IPV4_ONLY
}

function loop() {
    if (timeout) {
        Mainloop.source_remove(timeout);
        timeout = null;
    }

    const children = Main.panel._rightBox.get_children();
    let count = 0;
    for (let i=0; i < children.length; i++) {
        if (children[i].shepherdManaged) {
            if (i != count) {
                Main.panel._rightBox.remove_child(children[i]);
                Main.panel._rightBox.insert_child_at_index(children[i], count);
            }

            count++;
        }
    }

    timeout = Mainloop.timeout_add_seconds(10, loop);
}

function enable() {
    loop();
}

function disable() {
    Mainloop.source_remove(loop);
    for (const id in buttons) {
        Main.panel._rightBox.remove_child(buttons[id]);
        delete buttons[id];
    }
}
