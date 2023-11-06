import { theme } from 'app/presentation/theme';
import { Dimensions } from 'app/presentation/theme/Dimensions';
import { FontNames } from 'app/presentation/theme/ThemeDefault';
import LinkingHelper from 'app/shared/helper/LinkingHelper';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import HTML, { CustomRendererProps, RenderHTMLProps, TBlock } from 'react-native-render-html';
import WebView from 'react-native-webview';
import ImageRenderer from '../image/ImageRenderer';

interface IProps extends RenderHTMLProps {
    htmlContent?: string;
    onLinkPress?: (evt: any, href: string) => void;
    webViewStyle?: any;
    imageStyle?: any;
    contentStyle?: any;
}

type Props = Omit<IProps, 'source'>

const customerRenderers = (props: Props) => {
    return {
        img: (props: CustomRendererProps<TBlock>) => {
            const { tnode, style } = props;
            const src = tnode.attributes && tnode.attributes.src ? tnode.attributes.src : '';
            return <ImageRenderer
                key={Math.random().toString()}
                source={src}
                style={[styles.customImage, style]}
                resizeMode={'cover'}
            />;
        },
        iframe: (props: CustomRendererProps<TBlock>) => {
            const { tnode, style } = props;
            const src = tnode.attributes && tnode.attributes.src ? tnode.attributes.src : '';
            return <WebView
                key={Math.random().toString()}
                source={{ uri: src }}
                style={[styles.customImage, style]}
                javaScriptEnabled
            />;
        },
    };
};

const HTMLRenderer = (props: Props) => {
    const { htmlContent, onLinkPress, contentStyle, ...rest } = props;

    const _onLinkPress = useCallback((evt: any, href: string) => {
        if (onLinkPress) {
            onLinkPress(evt, href);
        } else {
            LinkingHelper.openUrl(href).catch(console.info);
        }
    }, [onLinkPress]);

    if (htmlContent) {
        return (
            <HTML
                defaultTextProps={{
                    allowFontScaling: false,
                }}
                renderers={customerRenderers(props)}
                renderersProps={{
                    a: {
                        onPress: _onLinkPress,
                    },
                }}
                tagsStyles={tagStyles}
                baseStyle={{
                    ...theme.textVariants.body1,
                    width: Dimensions.screenWidth() - 2 * theme.spacing.extraHuge,
                    ...contentStyle,
                }}
                systemFonts={[
                    FontNames.Normal,
                    FontNames.Bold,
                    FontNames.SemiBold,
                ]}
                contentWidth={Dimensions.screenWidth() - 2 * theme.spacing.extraHuge}
                {...rest}
                source={{ html: htmlContent }}
            />
        );
    }

    return null;
};

const defaultTextStyle = theme.textVariants.body1 as any;

const tagStyles = {
    body: defaultTextStyle,
    p: defaultTextStyle,
    a: {
        ...defaultTextStyle,
        color: 'blue',
    },
    strong: {
        ...defaultTextStyle,
        fontFamily: theme.textVariants.title1.fontFamily,
    },
    li: defaultTextStyle,
    ul: defaultTextStyle,
    ol: defaultTextStyle,
};

const styles = StyleSheet.create({
    customImage: {
        width: Dimensions.screenWidth() - 2 * theme.spacing.large,
        aspectRatio: 16 / 9,
    },
});

export default React.memo(HTMLRenderer);
