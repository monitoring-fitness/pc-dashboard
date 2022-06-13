import { AppDispatch, AppRootState } from '@/store';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 封装redux 的hooks，好处是不用到处写类型。

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector;
