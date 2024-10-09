export class ContextMenuActionButtonModel {
    id: string;
    label: string;
    icon: number;
    tintColor: string;

    constructor(id: string, label: string, icon: number, tintColor: string) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.tintColor = tintColor;
    }
}
