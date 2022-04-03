<template>
  <div>
    <EditDialog
      :isDelete="isDeleteDialogOpen"
      :handleDialog="handleDialog"
      :handleItem="handleCurrentItem"
      class="dialogComponent"
    />
    <div class="actionContainer">
      <v-text-field
        v-model="search"
        dark
        class="searchInput"
        outlined
        dense
        append-icon="mdi-magnify"
        label="Search"
        hide-details
      ></v-text-field>
      <v-btn color="#ff7b00" outlined @click="handleAddButtonBehavior">
        Add Customer
      </v-btn>
    </div>
    <v-data-table
      dark
      max-height="300"
      fixed-header
      :headers="headers"
      :items="items"
      :search="search"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-menu
          dark
          origin="center center"
          transition="scale-transition"
          class="actionMenu"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item class="actionItem">
              <v-btn text @click="editItem(item)">
                <v-icon>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-list-item>
            <v-list-item class="actionItem">
              <v-btn text @click="deleteItem(item)">
                <v-icon color="error">mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import EditDialog from '@/components/EditDialog';
import customerService from '@/services/customer.service';
import { mapState, mapActions } from 'vuex';
export default {
  components: { EditDialog },

  data() {
    return {
      headers: [],
      itemsPerPage: 5,
      headers: [],
      items: [],
      search: '',

      isDeleteDialogOpen: false,
    };
  },

  async created() {
    await this.getAllCustomers();
    if (this.allCustomers.length > 0) {
      this.setHeaders();
      this.setItems(this.allCustomers);
    }
  },

  computed: {
    ...mapState({
      allCustomers: (state) => state.allCustomers,
      currentCustomer: (state) => state.currentCustomer,
      isEdit: (state) => state.isEdit,
      isAdd: (state) => state.isAdd,
    }),
  },

  methods: {
    ...mapActions([
      'getAllCustomers',
      'getCustomer',
      'changeCurrentCustomer',
      'changeIsEdit',
      'changeIsAdd',
    ]),

    setHeaders() {
      this.headers = [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'CPF',
          value: 'cpf',
        },
        {
          text: 'Phone',
          value: 'contact.phone',
          sortable: false,
        },
        {
          text: 'Email',
          value: 'contact.email',
        },
      ];

      this.headers.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      });
    },

    setItems(data) {
      data.forEach((dt) => {
        dt.name = this.capitalize(dt.name);
        if (this.items.length <= data.length) {
          this.items.push(dt);
        }
      });
    },

    handleDialog(action, behavior) {
      if (action === 'add' && behavior === 'open') {
        this.changeIsAdd(true);
      }

      if (action === 'add' && behavior === 'close') {
        this.changeIsAdd(false);
      }

      if (action === 'edit' && behavior === 'open') {
        this.changeIsEdit(true);
      }

      if (action === 'edit' && behavior === 'close') {
        this.changeIsEdit(false);
      }

      if (action === 'delete' && behavior === 'open') {
        this.isDeleteDialogOpen = true;
      }

      if (action === 'delete' && behavior === 'close') {
        this.isDeleteDialogOpen = false;
      }
    },

    addItem() {
      this.handleDialog('add', 'open');
    },

    editItem(item) {
      this.$router.replace({ name: 'Register' });
      this.changeCurrentCustomer(item);

      this.handleDialog('edit', 'open');
    },

    deleteItem(item) {
      this.changeCurrentCustomer(item);

      this.handleDialog('delete', 'open');
    },

    async handleCurrentItem(action, item) {
      let index;

      await this.getCustomer(item.id);

      if (action === 'delete') {
        await customerService.deleteCustomer(item.id);
        index = this.items.findIndex(
          (customer) => customer.id === this.currentCustomer.id
        );

        this.items.splice(index, 1);
        this.handleDialog('delete', 'close');
      } else return;
    },

    capitalize(value) {
      if (!value) return '';
      return value.toLowerCase().replace(/(?:^|\s)\S/g, (text) => {
        return text.toUpperCase();
      });
    },

    handleAddButtonBehavior() {
      this.changeCurrentCustomer({});
      this.changeIsEdit(false);
      this.addItem('add', 'open');
      return this.$router.replace({ name: 'Register' });
    },
  },
};
</script>
<style lang="scss">
@import 'src/sass/master.scss';
</style>
