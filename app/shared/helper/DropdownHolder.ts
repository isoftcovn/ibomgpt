import DropdownAlert from 'react-native-dropdownalert';
import { getString } from '../../presentation/localization';

export default class DropDownHolder {
    static dropDown?: DropdownAlert;

    static setDropDown(dropDown: DropdownAlert) {
        DropDownHolder.dropDown = dropDown;
    }

    static getDropDown() {
        return DropDownHolder.dropDown;
    }

    static showSuccessAlert = (message: string, title?: string, interval?: number) => {
        if (DropDownHolder.dropDown) {
            const _title = title ? title : getString('success').toString();
            DropDownHolder.dropDown.alertWithType('success', _title, message, undefined, interval ? interval : 0);
        }
    };

    static showErrorAlert = (message: string, title?: string, interval?: number) => {
        if (DropDownHolder.dropDown) {
            const _title = title ? title : getString('error').toString();
            DropDownHolder.dropDown.alertWithType('error', _title, message, undefined, interval ? interval : 0);
        }
    };

    static showInfoAlert = (message: string, title?: string, interval?: number) => {
        if (DropDownHolder.dropDown) {
            const _title = title ? title : getString('info').toString();
            DropDownHolder.dropDown.alertWithType('info', _title, message, undefined, interval ? interval : 0);
        }
    };
}
