const supabase = require('../config/storage');
const pool = require('../config/db');

async function uploadProduto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const { produto_id } = req.params;
    const { is_principal, ordem } = req.body;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/${produto_id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('produtos')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { data } = supabase.storage.from('produtos').getPublicUrl(path);
    const url = data.publicUrl;

    await pool.query(
      `INSERT INTO produto_imagens (produto_id, url, ordem, is_principal)
       VALUES ($1, $2, $3, $4)`,
      [produto_id, url, ordem || 0, is_principal === 'true']
    );

    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadVendedorPerfil(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/perfil.${ext}`;

    const { error } = await supabase.storage
      .from('vendedores')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('vendedores').getPublicUrl(path);
    const url = data.publicUrl;

    await pool.query(
      `UPDATE vendedores SET foto_perfil_url=$1 WHERE usuario_id=$2`,
      [url, req.usuarioId]
    );

    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadVendedorBanner(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const ext = req.file.mimetype.split('/')[1];
    const path = `${req.usuarioId}/banner.${ext}`;

    const { error } = await supabase.storage
      .from('vendedores')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('vendedores').getPublicUrl(path);
    const url = data.publicUrl;

    await pool.query(
      `UPDATE vendedores SET banner_url=$1 WHERE usuario_id=$2`,
      [url, req.usuarioId]
    );

    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadMarca(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { marca_id } = req.params;
    const { nome } = req.body;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${marca_id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('marcas')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('marcas').getPublicUrl(path);
    const url = data.publicUrl;

    await pool.query(
      `INSERT INTO marca_imagens (marca_id, url, nome, ordem)
       VALUES ($1, $2, $3, $4)`,
      [marca_id, url, nome || '', 0]
    );

    await pool.query(
      `UPDATE marcas SET logo_url=$1 WHERE id=$2`,
      [url, marca_id]
    );

    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function uploadEvento(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { evento_id } = req.params;
    const ext = req.file.mimetype.split('/')[1];
    const path = `${evento_id}/banner.${ext}`;

    const { error } = await supabase.storage
      .from('eventos')
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });

    if (error) return res.status(500).json({ error: error.message });

    const { data } = supabase.storage.from('eventos').getPublicUrl(path);
    const url = data.publicUrl;

    await pool.query(
      `UPDATE eventos SET banner_url=$1 WHERE id=$2`,
      [url, evento_id]
    );

    return res.json({ url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadProduto, uploadVendedorPerfil, uploadVendedorBanner, uploadMarca, uploadEvento };