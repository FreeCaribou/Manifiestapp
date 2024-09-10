import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Address } from 'src/api/tickets/address.entity';
import { ConfirmTicketsDto } from 'src/api/tickets/dto/confirm-tickets.dto';

// If in the args, askSendTicket is true, we need to check the address
// Verification of presence of street, number, postCode and city
@ValidatorConstraint({ name: 'addressNeeded', async: false })
export class AddressNeededValidator implements ValidatorConstraintInterface {
  validate(address: Address, args: ValidationArguments) {
    if ((args.object as ConfirmTicketsDto).askSendTicket) {
      if (address) {
        if (!(!!address.street && !!address.number && !!address.postCode && !!address.city)) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Address need a street, number, postCode and city';
  }
}