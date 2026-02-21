import { useState, useRef, useCallback } from 'react';
import {
  getWorkspaces,
  createWorkspace,
  deleteWorkspace,
  setWorkspaceHash,
  type Workspace,
} from '../lib/storage';
import { useT } from '../lib/i18n';
import styles from './NutrientCalculator.module.css';

interface Props {
  onEnter: (workspaceId: string) => void;
}

export default function WorkspaceLanding({ onEnter }: Props) {
  const { t } = useT();
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => getWorkspaces());
  const [newName, setNewName] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const ws = createWorkspace(name);
    setWorkspaceHash(ws.id);
    onEnter(ws.id);
  };

  const handleEnter = (ws: Workspace) => {
    setWorkspaceHash(ws.id);
    onEnter(ws.id);
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteId(id);
    dialogRef.current?.showModal();
  };

  const confirmDelete = useCallback(() => {
    if (pendingDeleteId) {
      deleteWorkspace(pendingDeleteId);
      setWorkspaces(getWorkspaces());
    }
    setPendingDeleteId(null);
    dialogRef.current?.close();
  }, [pendingDeleteId]);

  const cancelDelete = useCallback(() => {
    setPendingDeleteId(null);
    dialogRef.current?.close();
  }, []);

  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'center', padding: '2rem 0 1rem' }}>
        <h1 className={styles.title} style={{ fontSize: '1.5rem' }}>
          {t.workspace.title}
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 2rem' }}>
          {t.workspace.subtitle}
        </p>
      </div>

      {/* Create new */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>{t.workspace.newWorkspace}</div>
        <div className={styles.saveRow}>
          <input
            type="text"
            className={styles.saveInput}
            placeholder={t.workspace.placeholder}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleCreate}
            disabled={!newName.trim()}
          >
            {t.common.create}
          </button>
        </div>
      </div>

      {/* Existing workspaces */}
      {workspaces.length > 0 && (
        <div className={styles.card}>
          <div className={styles.sectionTitle}>{t.workspace.yourWorkspaces}</div>
          {workspaces.map((ws) => (
            <div key={ws.id} className={styles.workspaceItem}>
              <button
                type="button"
                className={styles.workspaceInfo}
                onClick={() => handleEnter(ws)}
                style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}
              >
                <span className={styles.workspaceName}>{ws.name}</span>
                <span className={styles.workspaceId}>#{ws.id}</span>
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={(e) => requestDelete(ws.id, e)}
                title={t.workspace.deleteWorkspace}
                aria-label={`${t.workspace.deleteWorkspace} ${ws.name}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation dialog */}
      <dialog ref={dialogRef} className={styles.confirmDialog}>
        <p className={styles.confirmMessage}>{t.workspace.confirmDelete}</p>
        <div className={styles.confirmActions}>
          <button type="button" className={styles.toolbarBtn} onClick={cancelDelete}>
            {t.common.cancel}
          </button>
          <button type="button" className={styles.confirmDeleteBtn} onClick={confirmDelete}>
            {t.workspace.deleteWorkspace}
          </button>
        </div>
      </dialog>
    </div>
  );
}
