var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BehaviorSubject } from "rxjs";
import { setDappState, tryGetDappState } from "../../../libs/o-os/loader";
import { BN } from "ethereumjs-util";
import { DelayedTrigger } from "../../../libs/o-os/delayedTrigger";
const myCirclesBalancesSubject = new BehaviorSubject({
    payload: []
});
let myBalances = [];
const updateTrigger = new DelayedTrigger(30, () => __awaiter(void 0, void 0, void 0, function* () {
    const current = myCirclesBalancesSubject.getValue();
    myCirclesBalancesSubject.next({
        signal: current === null || current === void 0 ? void 0 : current.signal,
        payload: myBalances
    });
}));
export function initMyBalances() {
    return __awaiter(this, void 0, void 0, function* () {
        const safeState = tryGetDappState("omo.safe:1");
        safeState.myTransactions.subscribe(transactions => {
            const amounts = transactions.payload.map(o => {
                return {
                    token: o.token,
                    amount: o.direction == "out" ? o.amount.neg() : o.amount,
                    blockNo: o.blockNo
                };
            });
            amounts.reverse();
            const balances = amounts.reduce((p, c) => {
                if (!p[c.token]) {
                    p[c.token] = {
                        balance: new BN("0"),
                        lastBlockNo: 0
                    };
                }
                p[c.token] = {
                    balance: p[c.token].balance.add(c.amount),
                    lastBlockNo: p[c.token].lastBlockNo < c.blockNo ? c.blockNo : p[c.token].lastBlockNo
                };
                return p;
            }, {});
            myBalances = Object.keys(balances).map(key => {
                const balance = balances[key];
                return {
                    tokenAddress: key,
                    balance: balance.balance,
                    lastBlockNo: balance.lastBlockNo
                };
            });
            updateTrigger.trigger();
        });
        setDappState("omo.safe:1", existing => {
            return Object.assign(Object.assign({}, existing), { myBalances: myCirclesBalancesSubject });
        });
    });
}
