//@flow

import { type AsyncStorage } from 'mtproto-shared'
// import { fromNullable, Maybe, Just, Nothing } from 'folktale/maybe'

import { Maybe } from 'apropos'
const { fromNullable, Just, Nothing } = Maybe

import { type DCNumber } from 'Newtype'

export default class StorageAdapter {
  storage: AsyncStorage
  constructor(storage: AsyncStorage) {
    this.storage = storage
  }
  async getAuthKey(dc: DCNumber): Promise<Maybe<number[]>> {
    const data = await this.storage.get(`dc${String(dc)}_auth_key`)
    return fromNullable(data)
      .chain(validateArray)
  }
  async getSalt(dc: DCNumber): Promise<Maybe<number[]>> {
    const data = await this.storage.get(`dc${String(dc)}_server_salt`)
    return fromNullable(data)
      .chain(validateArray)
  }
  async getAuthID(dc: DCNumber): Promise<Maybe<number[]>> {
    const data = await this.storage.get(`dc${String(dc)}_auth_id`)
    return fromNullable(data)
      .chain(validateArray)
  }
  async getNearestDC(): Promise<Maybe<number>> {
    const data = await this.storage.get(`nearest_dc`)
    return fromNullable(data)
      .chain(validateNumber)
  }
  async getDC(): Promise<Maybe<number>> {
    const data = await this.storage.get(`dc`)
    return fromNullable(data)
      .chain(validateNumber)
  }

  async setAuthKey(dc: DCNumber, data: number[]): Promise<void> {
    await this.storage.set(`dc${String(dc)}_auth_key`, data)
  }
  async setSalt(dc: DCNumber, data: number[]): Promise<void> {
    await this.storage.set(`dc${String(dc)}_server_salt`, data)
  }
  async setAuthID(dc: DCNumber, data: number[]): Promise<void> {
    await this.storage.set(`dc${String(dc)}_auth_id`, data)
  }
  async setNearestDC(dc: DCNumber): Promise<void> {
    await this.storage.set(`nearest_dc`, dc)
  }
  async setDC(dc: DCNumber): Promise<void> {
    await this.storage.set(`dc`, dc)
  }

  async removeAuthKey(dc: DCNumber): Promise<void> {
    await this.storage.remove(`dc${String(dc)}_auth_key`)
  }
  async removeSalt(dc: DCNumber): Promise<void> {
    await this.storage.remove(`dc${String(dc)}_server_salt`)
  }
  async removeAuthID(dc: DCNumber): Promise<void> {
    await this.storage.remove(`dc${String(dc)}_auth_id`)
  }
  async removeNearestDC(): Promise<void> {
    await this.storage.remove(`nearest_dc`)
  }
  async removeDC(): Promise<void> {
    await this.storage.remove(`dc`)
  }
}

function validateArray(data): Maybe<number[]> {
  if (Array.isArray(data)) {
    if (data.every(n => typeof n === 'number')) {
      return Just(data)
    }
  }
  return Nothing()
}

function validateNumber(data): Maybe<number> {
  if (typeof data === 'number') return Just(data)
  if (typeof data === 'string') {
    if (isFinite(data)) {
      const num = parseInt(data, 10)
      if (num > 0)
        return Just(num)
    }
  }
  return Nothing()
}
