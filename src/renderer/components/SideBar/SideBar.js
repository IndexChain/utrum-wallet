/** ***************************************************************************
 * Copyright © 2018 Monaize Singapore PTE. LTD.                               *
 *                                                                            *
 * See the AUTHORS, and LICENSE files at the top-level directory of this      *
 * distribution for the individual copyright holder information and the       *
 * developer policies on copyright and licensing.                             *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Monaize Singapore PTE. LTD software, including this file may be copied,    *
 * modified, propagated or distributed except according to the terms          *
 * contained in the LICENSE file                                              *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

export default {
  name: 'sidebar',
  data() {
    return {
      balanceState: true,
      hodlState: false,
      withdrawalState: false,
      socialState: false,
      chartState: false,
      aboutState: false,
    };
  },
  methods: {
    balanceClicked() {
      this.balanceState = true;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = false;
      this.aboutState = false;
    },
    hodlClicked() {
      this.balanceState = false;
      this.hodlState = true;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = false;
      this.aboutState = false;
    },
    withdrawalClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = true;
      this.socialState = false;
      this.chartState = false;
      this.aboutState = false;
    },
    socialClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = true;
      this.chartState = false;
      this.aboutState = false;
    },
    chartClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = true;
      this.aboutState = false;
    },
    aboutClicked() {
      this.balanceState = false;
      this.hodlState = false;
      this.withdrawalState = false;
      this.socialState = false;
      this.chartState = false;
      this.aboutState = true;
    },
    logoutClicked() {
      this.$store.dispatch('logout')
      this.$router.push('login');
    },
  },
  computed: {
  },
};
