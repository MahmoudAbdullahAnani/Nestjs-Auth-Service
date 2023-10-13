import { Column, Entity } from 'typeorm';

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
  userName: string;
  // password Column
  @Column()
  password: string;
  // role Column
  @Column()
  role: 'user';
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
  active: true;
}
