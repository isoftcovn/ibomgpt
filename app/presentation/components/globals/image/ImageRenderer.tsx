import GeneratedImages from 'app/assets/GeneratedImages';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import styled from 'styled-components';

interface Props {
    source?: string | number;
    hideLoadingIndicator?: boolean;
    style?: any;
    resizeMode?: ResizeMode;
}

interface State {
    loaded: boolean;
}

export default class ImageRenderer extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loaded: false,
        };
    }

    onLoad = () => {
        this.setState({
            loaded: true,
        });
    };

    renderImageWithPlaceholder = (source: any) => {
        const { style, hideLoadingIndicator, ...rest } = this.props;
        const { loaded } = this.state;

        const isStaticSource = typeof source === 'number';

        return <View style={style}>
            {!loaded && !hideLoadingIndicator && !isStaticSource ? <BackgroundLoading>
                <ActivityIndicator animating size={'large'} color={'gray'} />
            </BackgroundLoading> : null}
            {!isStaticSource ?
                <FastImage
                    resizeMode={'contain'}
                    {...rest}
                    source={source}
                    style={[styles.image, style]}
                    onLoad={this.onLoad}
                /> : <Image
                    resizeMode={'contain'}
                    {...rest}
                    source={source}
                    style={[styles.image, style]} />
            }
        </View>;
    };


    render() {
        const { source } = this.props;
        let _source: any;
        if (source) {
            if (typeof source === 'string' && (source.startsWith('http'))) {
                _source = {
                    uri: source,
                    priority: FastImage.priority.normal,
                };
            } else {
                _source = source;
            }
        } else {
            _source = GeneratedImages.app_logo;
        }

        return this.renderImageWithPlaceholder(_source);
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%',
    },
});

const BackgroundLoading = styled.View`
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        justifyContent: center;
        alignItems: center;
    `;
