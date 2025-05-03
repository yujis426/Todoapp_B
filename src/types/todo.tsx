export type Todo = {
  id: number;
  title: string;
  completed_flg?: boolean;  // optional にしておくと柔軟に使える
  delete_flg: boolean;
  start_date?: string;      // カレンダー連携向けに optional に
  end_date?: string;
  progress?: number;
  memo?: string;
};