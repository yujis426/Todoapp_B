export type Todo = {
  id: number;
  title: string;
  completed_flg: boolean;
  delete_flg: boolean;
  start_date: string;
  end_date: string;
  progress: number;
  note?: string; // ← 追加
};
