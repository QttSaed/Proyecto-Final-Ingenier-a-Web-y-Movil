import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Header from './Header';
import { apiService, localProducts } from '../services/apiService';

function Location() { return <output data-testid="location">{useLocation().pathname}{useLocation().search}</output>; }
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('buscador del header', () => {
  it('muestra hasta seis productos y abre su ficha limpiando la búsqueda', async () => {
    vi.spyOn(apiService, 'products').mockResolvedValue(localProducts.slice(0, 8));
    render(<MemoryRouter><Header /><Location /></MemoryRouter>);
    const input = screen.getByRole('textbox', { name: 'Buscar productos' });
    fireEvent.change(input, { target: { value: 'carta' } });
    await waitFor(() => expect(document.querySelectorAll('.search-result-item')).toHaveLength(6));
    fireEvent.click(document.querySelector('.search-result-item')!);
    expect(screen.getByTestId('location').textContent).toBe(`/product/${localProducts[0].id}`);
    expect(input).toHaveValue('');
    expect(document.querySelector('.search-results-dropdown')).toBeNull();
  });

  it('abre los resultados con Enter y cierra el menú con Escape o clic fuera', async () => {
    vi.spyOn(apiService, 'products').mockResolvedValue([]);
    render(<MemoryRouter><Header /><Location /></MemoryRouter>);
    const input = screen.getByRole('textbox', { name: 'Buscar productos' });
    fireEvent.change(input, { target: { value: 'sin coincidencias' } });
    await screen.findByText(/No se encontraron productos/);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.search-results-dropdown')).toBeNull();
    fireEvent.focus(input);
    expect(document.querySelector('.search-results-dropdown')).not.toBeNull();
    fireEvent.pointerDown(document.body);
    expect(document.querySelector('.search-results-dropdown')).toBeNull();
    fireEvent.submit(input.closest('form')!);
    expect(screen.getByTestId('location').textContent).toBe('/catalog/todos?search=sin%20coincidencias');
  });
});
