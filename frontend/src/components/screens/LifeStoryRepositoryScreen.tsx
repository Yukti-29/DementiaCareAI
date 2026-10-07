import React, { useState } from 'react';
import { ScreenId, MemoryMilestone } from '../../types';
import { INITIAL_MILESTONES, ASSETS } from '../../data/mockData';
import { playChime, speakMessage } from '../../utils/audio';

interface LifeStoryProps {
  onNavigate: (screen: ScreenId) => void;
}

export const LifeStoryRepositoryScreen: React.FC<LifeStoryProps> = ({ onNavigate }) => {
  const [milestones, setMilestones] = useState<MemoryMilestone[]>(INITIAL_MILESTONES);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('1975');
  const [newLocation, setNewLocation] = useState('Jaipur Heritage Trip');
  const [newDesc, setNewDesc] = useState('');

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    playChime('confirm');

    const created: MemoryMilestone = {
      id: `m-${Date.now()}`,
      year: newYear,
      category: 'Family Heritage',
      title: newTitle,
      location: newLocation,
      photoUrl: ASSETS.jaipur1975,
      description: newDesc || 'A treasured memory recorded by family.',
      mediaTags: ['Curated by Priya (Daughter)'],
      recallRate: 'High Emotional Value',
    };

    setMilestones([created, ...milestones]);
    setShowForm(false);
    setNewTitle('');
    setNewDesc('');
    speakMessage('New milestone saved to Dadaji’s Life Story Repository.', 'en-US', 0.85);
  };

  const playMilestoneAudio = (milestone: MemoryMilestone) => {
    playChime('gentle');
    speakMessage(
      `${milestone.year}: ${milestone.title}. ${milestone.description}`,
      'en-IN',
      0.85
    );
  };

  return (
    <div className="w-full min-h-screen bg-surface px-4 pt-20 pb-28 flex flex-col max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container mb-5 flex items-center justify-between">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider mb-0.5">
            <span className="material-symbols-outlined text-sm">history_edu</span>
            <span>Archival Life Story • संस्मरण धरोहर</span>
          </div>
          <h1 className="font-headline-md text-xl sm:text-2xl text-on-surface font-bold truncate">
            Dadaji's Life Story
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant">
            A curated reservoir of lifelong identities & pride
          </p>
        </div>

        <button
          className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-all"
          onClick={() => {
            playChime('gentle');
            setShowForm(!showForm);
          }}
          title="Add New Milestone"
          type="button"
        >
          <span className="material-symbols-outlined text-2xl">
            {showForm ? 'close' : 'add'}
          </span>
        </button>
      </div>

      {/* Add New Milestone Form (Drawer / Card) */}
      {showForm && (
        <form
          onSubmit={handleSaveMilestone}
          className="rounded-3xl bg-surface-container-lowest p-5 shadow-md border border-primary/30 mb-6 flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-base text-primary font-bold">
              Add Milestone to Life Story
            </h3>
            <span className="text-xs text-outline font-medium">Memory Curator</span>
          </div>

          <div className="flex gap-2">
            <div className="w-24">
              <label className="text-[11px] font-bold text-on-surface block mb-1">Year</label>
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container text-sm font-bold text-on-surface focus:outline-primary"
                placeholder="1975"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-bold text-on-surface block mb-1">Milestone Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-primary"
                placeholder="e.g. First Family Road Trip"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-primary"
              placeholder="e.g. Jaipur Fort"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-on-surface block mb-1">Comforting Story / Note</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface focus:outline-primary"
              placeholder="Explain how this photo evokes warmth and happiness for Dadaji..."
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-primary text-on-primary font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">save</span>
            <span>Save to Dadaji’s Sanctuary</span>
          </button>
        </form>
      )}

      {/* Chronological Milestone Feed */}
      <div className="flex flex-col gap-5">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container flex flex-col gap-3 hover:border-primary/40 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl text-primary font-bold">
                  {milestone.year}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                  {milestone.category}
                </span>
              </div>

              {milestone.recallRate && (
                <span className="text-[11px] font-semibold bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full">
                  {milestone.recallRate}
                </span>
              )}
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-container shadow-inner">
              <img src={milestone.photoUrl} alt={milestone.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">place</span>
                <span>{milestone.location}</span>
              </div>
            </div>

            <div>
              <h2 className="font-headline-sm text-lg text-on-surface font-bold leading-tight">
                {milestone.title}
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1 leading-relaxed">
                {milestone.description}
              </p>
            </div>

            <div className="pt-2 border-t border-surface-container flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {milestone.mediaTags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-semibold bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-full flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs text-primary">audiotrack</span>
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              <button
                className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center shrink-0 shadow-xs active:scale-95 hover:bg-primary-fixed transition-all"
                onClick={() => playMilestoneAudio(milestone)}
                title="Play story narration"
                type="button"
              >
                <span className="material-symbols-outlined text-xl">volume_up</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
