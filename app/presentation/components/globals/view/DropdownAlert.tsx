import { IErrorState, ISuccessState } from 'app/presentation/redux';
import DropdownHolder from 'app/shared/helper/DropdownHolder';
import React from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';

interface IProps {
    errorReducer: IErrorState;
    successReducer: ISuccessState;
}

interface IState {

}

const mapStateToProps = (state: any) => ({
    errorReducer: state.errorReducer,
    successReducer: state.successReducer,
});

const actions = {};

class DropdownAlertComp extends React.Component<IProps, IState> {

    shouldComponentUpdate(nextProps: IProps) {
        const { errorReducer, successReducer } = this.props;
        const errorReducerNext = nextProps.errorReducer;
        const successReducerNext = nextProps.successReducer;

        if (errorReducer !== errorReducerNext) {
            if (errorReducerNext.shouldShowMessage && errorReducerNext.errorMessage) {
                DropdownHolder.showErrorAlert(errorReducerNext.errorMessage);
                return false;
            }
        }
        if (successReducer !== successReducerNext) {
            if (successReducerNext.shouldShowMessage && successReducerNext.successMessage) {
                DropdownHolder.showSuccessAlert(successReducerNext.successMessage);
            }
            return false;
        }
        return false;
    }

    render() {
        return (
            <DropdownAlert
                messageNumOfLines={5}
                useNativeDriver={true}
                translucent={false}
                updateStatusBar={false}
                closeInterval={5000}
                ref={(ref: DropdownAlert) => DropdownHolder.setDropDown(ref)} />
        );
    }
}

export default connect(mapStateToProps, actions, undefined, { forwardRef: true })(DropdownAlertComp);
