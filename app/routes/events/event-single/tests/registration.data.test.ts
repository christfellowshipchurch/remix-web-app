import { describe, it, expect } from 'vitest';
import { getSubGroupTypeDescription } from '../registration.data';

describe('getSubGroupTypeDescription', () => {
  it('returns the English description by default', () => {
    expect(getSubGroupTypeDescription('Two Days')).toBe(
      'The Journey is the starting point to learn about the heartbeat of Christ Fellowship. Join us for a two-week experience in which you will Know God, Grow in your Relationships, Discover your Purpose & partner with us as we Impact the World together.',
    );
  });

  it('returns the CFDP-4104 Spanish translation when isSpanish is true', () => {
    expect(getSubGroupTypeDescription('Two Days', true)).toBe(
      '¡Journey es el primer paso para conectarte a Christ Fellowship! Es una clase de dos sesiones donde aprenderás sobre la historia y el corazón de nuestra iglesia. Durante esta experiencia, nuestra oración es que conozcas a Dios, crezcas en tu relación personal con Él y con otros para que puedas descubrir tu propósito e impactar al mundo.',
    );
  });

  it('returns the English Three Days description by default', () => {
    expect(getSubGroupTypeDescription('Three Days')).toBe(
      'The Journey is the starting point to learn the heartbeat of Christ Fellowship. Join us for a three-part experience in which you will Know God, Grow in your Relationships, Discover your Purpose, & partner with us as we Impact the World together.',
    );
  });

  it('returns the Spanish Three Days translation when isSpanish is true', () => {
    expect(getSubGroupTypeDescription('Three Days', true)).toBe(
      '¡Journey es el primer paso para conectarte a Christ Fellowship! Es una clase de tres sesiones donde aprenderás sobre la historia y el corazón de nuestra iglesia. Durante esta experiencia, nuestra oración es que conozcas a Dios, crezcas en tu relación personal con Él y con otros para que puedas descubrir tu propósito e impactar al mundo.',
    );
  });
});
