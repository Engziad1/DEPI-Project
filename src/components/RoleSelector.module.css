.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: var(--space-md) var(--space-sm);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background var(--motion-fast);
  font-family: var(--font-body);
  text-align: center;
}

.card:hover:not(.disabled) {
  transform: translateY(-2px);
  border-color: var(--color-primary-light);
}

.active {
  border-color: var(--color-primary);
  background: rgba(44, 110, 138, 0.06);
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  font-size: 26px;
}

.label {
  font-weight: 700;
  font-size: 13.5px;
  color: var(--color-text);
}

.desc {
  font-size: 11px;
  color: var(--color-text-soft);
  line-height: 1.4;
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
