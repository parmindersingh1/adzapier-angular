
import {h, Component } from 'preact';

const defaultChildren = (shareCount: number) => shareCount;

type SocialMediaShareCountProps = any & {
  children?: (shareCount: number) => any;
  getCount: (url: string, callback: (shareCount?: number) => void) => void;
  url: string;
};

type StateTypes = {
  count?: number;
  isLoading: boolean;
};

class SocialMediaShareCount extends Component<SocialMediaShareCountProps, StateTypes> {
  _isMounted = false;

  constructor(props: SocialMediaShareCountProps) {
    super(props);
    this.state = { count: 0, isLoading: false };
  }

  componentDidMount() {
    this._isMounted = true;
    this.updateCount(this.props.url);
  }

  componentDidUpdate(prevProps: SocialMediaShareCountProps) {
    if (this.props.url !== prevProps.url) {
      this.updateCount(this.props.url);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateCount(url: string) {
    this.setState({
      isLoading: true,
    });

    this.props.getCount(url, count => {
      if (this._isMounted) {
        this.setState({
          count,
          isLoading: false,
        });
      }
    });
  }

  render() {
    const { count, isLoading } = this.state;

    const { children = defaultChildren, className, getCount: _, ...rest } = this.props;

    return (
      <span className={(className ? 'react-share__ShareCount': '')} {...rest}>
        {!isLoading && count !== undefined && children(count)}
      </span>
    );
  }
}

export default function createShareCount(getCount: SocialMediaShareCountProps['getCount']) {
  const ShareCount = (props: Omit<SocialMediaShareCountProps, 'getCount'>) => (
    <SocialMediaShareCount getCount={getCount} {...props} />
  );

  ShareCount.displayName = `ShareCount(${getCount.name})`;

  return ShareCount;
}
