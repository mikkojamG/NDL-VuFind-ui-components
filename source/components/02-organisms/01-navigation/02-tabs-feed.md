#### Description

Tabs component with content loaded dynamically from feed.

**Rendering with a helper function should be preferred:**

```
<?= $this->feedTabs(['title' => 'Otsikko', 'ids' => ['Tapahtumat' => 'news', 'Uutiset' => 'carousel', 'Muuta' => 'carousel-small']]) ?>
```

#### Properties

| Prop         | Type       | Required |
| ------------ | ---------- | -------- |
| tablistId    | `String`   | Yes      |
| tablistLabel | `String`   | Yes      |
| tabs         | `Object[]` | Yes      |

#### Child components

- `01-molecules/01-navigation/_tabs.phtml`
