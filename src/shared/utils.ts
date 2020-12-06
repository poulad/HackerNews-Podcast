import { exec } from 'child_process';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { Episode } from './episode.entity';

export function delay(miliseconds: number): Promise<void> {
  return parseInt(miliseconds?.toString()) > 0
    ? new Promise((resolve) => setTimeout(resolve, miliseconds))
    : null;
}

export async function isStoryProcessed(
  episodesRepo: Repository<Episode>,
  storyId: number,
): Promise<boolean> {
  const entity = await episodesRepo.findOne({
    where: { storyId },
    select: ['id'],
  });
  return !!entity;
}

export function execCommand(
  cmd: string,
  ...args: string[]
): Promise<{ stdout: string; stderr: string }> {
  const commandText = [cmd, ...(args || [])]
    .map((x) => JSON.stringify(x))
    .join(' ');
  return execFn(commandText);
}

const execFn = promisify(exec);
