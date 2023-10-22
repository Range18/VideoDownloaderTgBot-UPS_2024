import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('videos')
export class VideoEntity {
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  @Column({ nullable: false })
  readonly fieldId: string;

  @Column({ nullable: false })
  readonly url: string;
}
