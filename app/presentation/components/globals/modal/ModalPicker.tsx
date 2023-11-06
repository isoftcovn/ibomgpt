import { theme } from 'app/presentation/theme';
import React from 'react';
import { FlatList, Modal, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styles from './ModalPicker.styles';



let componentIndex = 0;

interface Props {
    data: Array<any>;
    onChange?: (item: any) => void;
    onModalOpen?: () => void;
    onModalClose?: () => void;
    keyExtractor: (item: any, index?: number) => string;
    labelExtractor: (item: any, index?: number) => string;
    visible?: boolean;
    closeOnChange?: boolean;
    initValue?: string;
    animationType?: string;
    style?: any;
    selectStyle?: any;
    selectTextStyle?: any;
    optionStyle?: any;
    optionTextStyle?: any;
    optionContainerStyle?: any;
    sectionStyle?: any;
    childrenContainerStyle?: any;
    touchableStyle?: any;
    touchableActiveOpacity?: number;
    sectionTextStyle?: any;
    selectedItemTextStyle?: any;
    cancelContainerStyle?: any;
    cancelStyle?: any;
    cancelTextStyle?: any;
    overlayStyle?: any;
    cancelText?: string;
    disabled?: boolean;
    supportedOrientations?: string;
    keyboardShouldPersistTaps?: 'always' | 'handled' | 'never' | boolean;

    backdropPressToClose?: boolean;
    accessible?: boolean;
    scrollViewAccessibilityLabel?: string;
    cancelButtonAccessibilityLabel?: string;
    passThruProps?: any;
    modalOpenerHitSlop?: any;
    customSelector?: React.ReactElement;
}

interface State {
    modalVisible?: boolean;
    selected?: string;
    cancelText?: string;
    changedItem?: any;
}

const defaultProps = {
    data: [],
    keyExtractor: (item: any) => item.key,
    labelExtractor: (item: any) => item.label,
    visible: false,
    closeOnChange: true,
    initValue: 'Select me!',
    animationType: Platform.OS === 'android' ? 'fade' : 'slide',
    style: {},
    selectStyle: {},
    selectTextStyle: {},
    optionStyle: {},
    optionTextStyle: {
        color: theme.color.textColor,
    },
    optionContainerStyle: {},
    sectionStyle: {},
    childrenContainerStyle: {},
    touchableStyle: {},
    touchableActiveOpacity: 0.7,
    sectionTextStyle: {},
    selectedItemTextStyle: {},
    cancelContainerStyle: {},
    cancelStyle: {},
    cancelTextStyle: {},
    overlayStyle: {},
    cancelText: 'Cancel',
    disabled: false,
    supportedOrientations: ['portrait', 'landscape'],
    keyboardShouldPersistTaps: 'always',
    backdropPressToClose: true,
    accessible: false,
    scrollViewAccessibilityLabel: undefined,
    cancelButtonAccessibilityLabel: undefined,
    passThruProps: {},
    modalOpenerHitSlop: { top: 0, bottom: 0, left: 0, right: 0 },
    customSelector: undefined,
};


export default class ModalSelector extends React.PureComponent<Props, State> {

    modal?: any;

    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);

        this.state = {
            modalVisible: props.visible,
            selected: props.initValue,
            cancelText: props.cancelText,
            changedItem: undefined,
        };
    }

    componentDidUpdate(prevProps: Props) {
        const newState: State = {};
        let doUpdate = false;
        if (prevProps.initValue !== this.props.initValue) {
            newState.selected = this.props.initValue;
            doUpdate = true;
        }
        if (prevProps.visible !== this.props.visible) {
            newState.modalVisible = this.props.visible;
            doUpdate = true;
        }
        if (doUpdate) {
            this.setState(newState);
        }
    }

    onChange = (item: any) => {
        // if (Platform.OS === "android" || !Modal.propTypes.onDismiss) {
        //     // RN >= 0.50 on iOS comes with the onDismiss prop for Modal which solves RN issue #10471
        //
        // }

        if (this.props.onChange) {
            this.props.onChange(item);
        }
        if (this.props.labelExtractor) {
            this.setState({ selected: this.props.labelExtractor(item), changedItem: item }, () => {
                if (this.props.closeOnChange) {
                    this.close();
                }
            });
        }
    };

    getSelectedItem() {
        return this.state.changedItem;
    }

    close = () => {
        if (this.props.onModalClose) {
            this.props.onModalClose();
        }
        this.setState({
            modalVisible: false,
        });
    };

    open = () => {
        if (this.props.onModalOpen) {
            this.props.onModalOpen();
        }
        this.setState({
            modalVisible: true,
            changedItem: undefined,
        });
    };

    renderSection = (section: any) => {
        return (
            <View key={this.props.keyExtractor(section)} style={[styles.sectionStyle, this.props.sectionStyle]}>
                <Text
                    style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{this.props.labelExtractor(section)}</Text>
            </View>
        );
    };

    renderOption = (option: any, isLastItem?: boolean) => {
        const optionLabel = this.props.labelExtractor(option);
        const isSelectedItem = optionLabel === this.state.selected;

        return (
            <TouchableOpacity
                key={this.props.keyExtractor(option)}
                onPress={() => this.onChange(option)}
                activeOpacity={this.props.touchableActiveOpacity}
                accessible={this.props.accessible}
                accessibilityLabel={option.accessibilityLabel || undefined}
                {...this.props.passThruProps}
            >
                <View style={[styles.optionStyle, this.props.optionStyle, isLastItem &&
                    { borderBottomWidth: 0 }]}>
                    <Text style={[styles.optionTextStyle, this.props.optionTextStyle, isSelectedItem && this.props.selectedItemTextStyle]}>
                        {optionLabel}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    renderOptionList = () => {
        const { keyExtractor } = this.props;
        // let options = this.props.data.map((item, index) => {
        //     if (item.section) {
        //         return this.renderSection(item);
        //     }
        //     return this.renderOption(item, index === this.props.data.length - 1);
        // });

        const closeOverlay = this.props.backdropPressToClose;
        return (
            <TouchableWithoutFeedback key={'modalSelector' + (componentIndex++)} onPress={() => {
                if (closeOverlay) {this.close();}
            }}>
                <View style={[styles.overlayStyle, this.props.overlayStyle]}>
                    <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
                        <FlatList data={this.props.data}
                            keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps}
                            accessible={this.props.accessible}
                            accessibilityLabel={this.props.scrollViewAccessibilityLabel}
                            renderItem={({ item, index }) => this.renderOption(item, index === this.props.data.length - 1)}
                            keyExtractor={keyExtractor}
                        />
                    </View>
                    {
                        this.props.data && this.props.data.length === 0 ?
                            (<View style={[styles.cancelContainer, this.props.cancelContainerStyle]}>
                                <TouchableOpacity onPress={this.close} activeOpacity={this.props.touchableActiveOpacity}
                                    accessible={this.props.accessible}
                                    accessibilityLabel={this.props.cancelButtonAccessibilityLabel}>
                                    <View style={[styles.cancelStyle, this.props.cancelStyle]}>
                                        <Text
                                            style={[styles.cancelTextStyle, this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>) : null
                    }
                </View>
            </TouchableWithoutFeedback>);
    };

    render() {
        const dp = (
            <Modal
                transparent
                ref={element => this.modal = element}
                supportedOrientations={['portrait']}
                visible={this.state.modalVisible}
                onRequestClose={this.close}
                animationType={'slide'}
                onDismiss={() => {
                    if (this.state.changedItem && this.props.onChange) {
                        this.props.onChange(this.state.changedItem);
                    }
                }}
            >
                {this.renderOptionList()}
            </Modal>
        );


        return dp;
    }
}
