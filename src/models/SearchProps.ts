import { MutableRefObject} from 'react';
export default interface SearchProps {
    onChange: () => void;
    ref?: MutableRefObject<any>;
}