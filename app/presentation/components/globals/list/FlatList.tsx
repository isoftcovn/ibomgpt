import { theme } from 'app/presentation/theme';
import React from 'react';
import { ActivityIndicator, FlatList, FlatListProps, StyleSheet, View } from 'react-native';
import styled from 'styled-components';
import { getString } from 'app/presentation/localization';
import TextPrimary from '../text/TextPrimary';

interface Props extends FlatListProps<any> {
    emptyText?: string;
    separatorType?: 'space' | 'line';
    isLoadMore?: boolean;
    isLoading?: boolean;
}

interface State {

}

export default class MyFlatList extends React.PureComponent<Props, State> {
    _list?: FlatList<any> | null;

    static defaultProps = {
        separatorType: 'space',
        isLoadMore: false,
    };

    renderEmpty = () => {
        const { emptyText } = this.props;
        const text = emptyText ? emptyText : getString('listEmpty');
        return (
            <EmptyContainer>
                <Label>{text}</Label>
            </EmptyContainer>
        );
    };

    renderLoadMore = () => {
        const { isLoadMore } = this.props;
        if (isLoadMore) {
            return (
                <ViewCenter>
                    <ActivityIndicator animating size={'large'} />
                </ViewCenter>
            );
        }

        return null;
    };

    render() {
        const { separatorType, isLoading } = this.props;
        const separator = separatorType === 'space' ? Separator : <View style={styles.lineSeparator} />;
        if (isLoading) {
            return (
                <ViewCenter>
                    <ActivityIndicator animating size={'large'} />
                </ViewCenter>
            );
        }
        return <FlatList
            style={{ width: '100%' }}
            contentContainerStyle={styles.contentContainer}
            ListEmptyComponent={this.renderEmpty}
            ItemSeparatorComponent={separator}
            ListFooterComponent={this.renderLoadMore}
            initialNumToRender={5}
            onEndReachedThreshold={0.6}
            extraData={this.props.isLoadMore}
            {...this.props}
            ref={ref => this._list = ref}
        />;
    }
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.large,
        backgroundColor: theme.color.backgroundColorPrimary,
    },
    lineSeparator: {
        height: 1,
        backgroundColor: theme.color.colorSeparator,
    }
});

const EmptyContainer = styled.View`
    paddingVertical: ${theme.spacing.medium}px;
    paddingHorizontal: ${theme.spacing.large}px;
    justifyContent: center;
    alignItems: center;
`;

const Label = styled(TextPrimary)`
    color: ${theme.color.labelColor};
`;

const Separator = styled.View`
    marginTop: ${theme.spacing.large}px;    
`;

const ViewCenter = styled.View`
    width: 100%;
    paddingHorizontal: ${theme.spacing.medium}px;
    paddingVertical: ${theme.spacing.medium}px;
    justifyContent: center;
    alignItems: center;
`;
