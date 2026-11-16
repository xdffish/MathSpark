import React, { useState } from 'react';
import { Trash2, CheckCircle2, RotateCcw } from 'lucide-react';
import { WrongNoteEntry } from '../types/math';
import { ProblemSolverCard } from './ProblemSolverCard';

interface WrongNotesViewProps {
  wrongNotes: WrongNoteEntry[];
  onRemoveNote: (noteId: string) => void;
  onClearAll: () => void;
  onGoToPractice: () => void;
}

export const WrongNotesView: React.FC<WrongNotesViewProps> = ({
  wrongNotes,
  onRemoveNote,
  onClearAll,
  onGoToPractice,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    wrongNotes[0]?.id ?? null
  );

  const activeNote =
    wrongNotes.find((n) => n.id === selectedNoteId) ?? wrongNotes[0] ?? null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-sky-700 tracking-wide">
            复习与巩固 · 错题复盘本
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            差倍易错题复盘笔记本
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            做错过的题目会自动收录在这里。重新做对一次，就可以把它从错题本里“消灭”啦！
          </p>
        </div>

        {wrongNotes.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            清空错题本
          </button>
        )}
      </div>

      {wrongNotes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              当前没有待复习的错题
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              你还没有答错的题目，或者所有错题都已经复盘消灭掉啦！去“闯关练习”挑战几道新题吧。
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToPractice}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            前往闯关练习
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left list of wrong notes */}
          <aside className="lg:col-span-4 space-y-2.5">
            {wrongNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-white border-sky-300 shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-rose-700">{note.code}</span>
                      <span className="font-mono-math tabular-nums">
                        {new Date(note.timestamp).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">
                      {note.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                      {note.questionText}
                    </p>
                  </button>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono-math">
                      曾填：{Object.values(note.userAnswers).join(' / ')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveNote(note.id)}
                      className="text-slate-500 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      移出错题本
                    </button>
                  </div>
                </div>
              );
            })}
          </aside>

          {/* Right active review solver */}
          <div className="lg:col-span-8">
            {activeNote && (
              <ProblemSolverCard
                problem={activeNote.problem}
                onSolved={() => onRemoveNote(activeNote.id)}
                nextLabel="已掌握，移出错题本"
                defaultShowDiagram={true}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};
