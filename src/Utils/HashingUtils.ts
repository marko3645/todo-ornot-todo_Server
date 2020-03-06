import * as bcrypt from 'bcrypt';

export class HashingUtils{
    public static async HashText(text:string):Promise<string>{
      const saltRounds = 10;
      let salt:string = await bcrypt.genSalt(saltRounds);
      let hashedText = await bcrypt.hash(text, salt);
      return hashedText;       
    }

    public static async AreEqual(clearText, hash):Promise<boolean>{
        let areEqual = await bcrypt.compare(clearText, hash);
        return areEqual;
    }
}