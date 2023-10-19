import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Users {
  // id Column
  @Column({ primary: true, generated: 'uuid' })
  id: string;
  // firstName Column
  @Column()
  firstName: string;
  // lastName Column
  @Column()
  lastName: string;
  // email Column

  @Column()
  email: string;
  // userName Column
  @Column()
  // @Index({ unique: true })
  userName: string;
  // password Column
  @Column()
  password: string;
  // role Column
  @Column()
  role: string;
  // Age Column
  @Column()
  age: number;
  // phoneNumber Column
  @Column()
  phoneNumber: string;
  // Address Column
  @Column()
  address: string;
  // Active Column
  @Column()
  active: boolean;
  // verificationCode Column
  @Column()
  verificationCode: string;
}
