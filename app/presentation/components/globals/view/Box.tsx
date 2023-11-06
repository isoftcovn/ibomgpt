import { theme } from 'app/presentation/theme';
import React from 'react';
import { FlexAlignType, View, ViewStyle } from 'react-native';

interface IProps extends React.ComponentProps<typeof View> {
    marginTop?: keyof typeof theme.spacing | number;
    marginLeft?: keyof typeof theme.spacing | number;
    marginBottom?: keyof typeof theme.spacing | number;
    marginRight?: keyof typeof theme.spacing | number;

    paddingTop?: keyof typeof theme.spacing | number;
    paddingLeft?: keyof typeof theme.spacing | number;
    paddingBottom?: keyof typeof theme.spacing | number;
    paddingRight?: keyof typeof theme.spacing | number;

    style?: ViewStyle;
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    alignItems?: FlexAlignType;
    alignSelf?: 'auto' | FlexAlignType;
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    children?: any | any[];
}

export const convertSpacingTypeToNumber = (key: keyof typeof theme.spacing | number | undefined): number => {
    if (key === undefined) {return 0;}
    if (typeof key === 'number') {return key;}
    return theme.spacing[key];
};

export const Box = React.memo((props: IProps) => {
    const { paddingTop, paddingLeft, paddingBottom, paddingRight,
        marginTop, marginBottom, marginLeft, marginRight,
        style, direction, alignItems, alignSelf, justifyContent, ...rest } = props;
    return <View style={{
        ...style,
        paddingTop: style?.paddingTop ?? convertSpacingTypeToNumber(paddingTop),
        paddingLeft: style?.paddingLeft ?? convertSpacingTypeToNumber(paddingLeft),
        paddingRight: style?.paddingRight ?? convertSpacingTypeToNumber(paddingRight),
        paddingBottom: style?.paddingBottom ?? convertSpacingTypeToNumber(paddingBottom),
        marginTop: style?.marginTop ?? convertSpacingTypeToNumber(marginTop),
        marginLeft: style?.marginLeft ?? convertSpacingTypeToNumber(marginLeft),
        marginRight: style?.marginRight ?? convertSpacingTypeToNumber(marginRight),
        marginBottom: style?.marginBottom ?? convertSpacingTypeToNumber(marginBottom),
        flexDirection: style?.flexDirection ?? direction,
        alignItems: style?.alignItems ?? alignItems,
        alignSelf: style?.alignSelf ?? alignSelf,
        justifyContent: style?.justifyContent ?? justifyContent,
    }} {...rest} />;
});
